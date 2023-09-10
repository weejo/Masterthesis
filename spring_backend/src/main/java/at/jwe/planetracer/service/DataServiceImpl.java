package at.jwe.planetracer.service;

import at.jwe.planetracer.data.entity.HighscoreEntity;
import at.jwe.planetracer.data.entity.LevelEntity;
import at.jwe.planetracer.data.entity.ResultEntity;
import at.jwe.planetracer.data.record.*;
import at.jwe.planetracer.data.record.cluster.*;
import at.jwe.planetracer.data.record.highscore.Highscore;
import at.jwe.planetracer.data.record.highscore.HighscoreEntry;
import at.jwe.planetracer.data.record.level.LayerInfo;
import at.jwe.planetracer.data.record.level.Level;
import at.jwe.planetracer.repository.HighscoreRepository;
import at.jwe.planetracer.repository.LevelRepository;
import at.jwe.planetracer.repository.ResultRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.*;

import static org.apache.logging.log4j.Level.ERROR;
import static org.apache.logging.log4j.Level.INFO;

@RequiredArgsConstructor
@Service
@Transactional
@Log4j2
public class DataServiceImpl implements DataService {

    private final HighscoreRepository highscoreRepository;
    private final LevelRepository levelRepository;
    private final ResultRepository resultRepository;
    private final ObjectMapper objectMapper;

    @Override
    public boolean addLevel(MapData mapData) throws JsonProcessingException {
        log.log(INFO, "Adding Map!");
        Optional<LevelEntity> level = levelRepository.findByName(mapData.name());
        if (level.isPresent()) {
            return false;
        }

        Long mostLeft = null;
        Long mostRight = null;
        Long mostUp = null;
        Long mostDown = null;

        Random random = new Random();
        List<EnrichedPlanet> enrichedPlanets = new ArrayList<>();

        for (int index = 0; index < mapData.planets().length; index++) {
            Planet planet = mapData.planets()[index];

            if (mostRight == null || planet.x() > mostRight) {
                mostRight = planet.x();
            }
            if (mostLeft == null || planet.x() < mostLeft) {
                mostLeft = planet.x();
            }
            if (mostUp == null || planet.y() > mostUp) {
                mostUp = planet.y();
            }
            if (mostDown == null || planet.y() < mostDown) {
                mostDown = planet.y();
            }
            enrichedPlanets.add(new EnrichedPlanet(planet.x(), planet.y(), random.nextInt(6), "planet", index));
        }

        if (mostUp == null || mostRight == null || mostLeft == null || mostDown == null) {
            log.log(ERROR, "Map values are not set!");
            return false;
        }

        String objects = objectMapper.writeValueAsString(enrichedPlanets);



        LevelEntity levelEntity = LevelEntity.builder()
                .initialTime(mapData.initialTime() != null? mapData.initialTime() : 30)
                .maxDistance(mapData.maxDistance() != null? mapData.maxDistance() : 100)
                .minNeighbors(mapData.minNeighbors() != null? mapData.minNeighbors() : 2)
                .name(mapData.name() != null? mapData.name() : "NoName"+Math.random())
                .numPlanets(enrichedPlanets.size())
                .heightCorrection(mapData.heightCorrection() != null? mapData.heightCorrection() : 0)
                .levelX(mostLeft - 600)
                .height(Math.abs(mostUp) + Math.abs(mostDown) + 1200)
                .width(Math.abs(mostLeft) + Math.abs(mostRight) + 1200)
                .objects(objects).build();

        levelRepository.save(levelEntity);
        return true;
    }



    @Override
    public ClusterResult getClusters(Long levelId) throws JsonProcessingException {

        List<ResultEntity> allByLevelId = resultRepository.findAllByLevelId(levelId);
        List<ClusterCollection> clusterCollections = new ArrayList<>();

        for (ResultEntity resultEntity : allByLevelId) {

            List<Cluster> clusterList = objectMapper.readValue(resultEntity.getResult(), objectMapper.getTypeFactory().constructCollectionType(List.class, Cluster.class));

            clusterCollections.add(new ClusterCollection(clusterList));
        }
        return new ClusterResult(clusterCollections);
    }

    @Override
    public List<IncidenceMatrix> getIncidences(Long levelId) throws JsonProcessingException {
        List<ResultEntity> allByLevelId = resultRepository.findAllByLevelId(levelId);
        List<IncidenceMatrix> incidenceCollections = new ArrayList<>();
        for (ResultEntity resultEntity : allByLevelId) {
            incidenceCollections.add(objectMapper.readValue(resultEntity.getIncidence(), IncidenceMatrix.class));
        }
        return incidenceCollections;
    }

    @Override
    public boolean addResult(PlayerResult playerResult) throws JsonProcessingException {
        Long levelId = playerResult.levelId();

        // We only want winners - otherwise it would not be fully clustered data.
        List<Cluster> clusters = playerResult.clusters();
        if (!clusters.isEmpty()) {

            computeClusters(clusters, levelId);
        }

        List<HighscoreEntity> allByLevelId = highscoreRepository.findAllByLevelId(levelId);

        HighscoreEntity newScore = HighscoreEntity.builder().points(playerResult.entry().points()).name(playerResult.entry().name()).levelId(levelId).build();

        if (allByLevelId.size() < 5) {
            allByLevelId.add(newScore);
            highscoreRepository.save(newScore);
            return true;
        } else {
            HighscoreEntity lowest = null;
            boolean bLowerThanNew = false;
            for (HighscoreEntity highscoreEntity : allByLevelId) {
                if (highscoreEntity.getPoints() < newScore.getPoints()) {
                    bLowerThanNew = true;
                }

                if (lowest == null) {
                    lowest = highscoreEntity;
                }

                if (lowest.getPoints() > highscoreEntity.getPoints()) {
                    lowest = highscoreEntity;
                }
            }
            if (bLowerThanNew) {
                highscoreRepository.delete(lowest);
                highscoreRepository.save(newScore);
                return true;
            }
        }
        return false;
    }

    private void computeClusters(List<Cluster> clusters, Long levelId) throws JsonProcessingException {
        Optional<LevelEntity> levelOpt = levelRepository.findById(levelId);
        if (levelOpt.isEmpty()) return;
        LevelEntity level = levelOpt.get();

        // create incidence array and fill it with 0s
        int[][] incidence = new int[level.getNumPlanets()][level.getNumPlanets()];

        // compute incidences
        for (Cluster cluster : clusters) {
            for (int index = 0; index < cluster.planetList().size(); index++) {
                Planet planet = cluster.planetList().get(index);
                for (int inner = index; inner < cluster.planetList().size(); inner++) {
                    incidence[cluster.planetList().get(inner).id()][planet.id()] = 1;
                    incidence[planet.id()][cluster.planetList().get(inner).id()] = 1;
                }
            }
        }

        String clusterJSON = objectMapper.writeValueAsString(clusters);
        String incidenceJSON = objectMapper.writeValueAsString(new IncidenceMatrix(incidence));

        ResultEntity resultEntity = ResultEntity.builder().result(clusterJSON).incidence(incidenceJSON).levelId(levelId).build();

        resultRepository.save(resultEntity);
    }

    @Override
    public Highscore getHighscore(Long levelId) {
        Optional<LevelEntity> level = levelRepository.findById(levelId);

        if (level.isEmpty()) return null;

        List<HighscoreEntity> highscoreEntities = highscoreRepository.findAllByLevelId(levelId);

        List<HighscoreEntity> sorted = highscoreEntities.stream().sorted(Comparator.comparing(HighscoreEntity::getPoints).reversed()).toList();

        List<HighscoreEntry> highscore = new ArrayList<>();
        for (HighscoreEntity highscoreEntity : sorted) {
            highscore.add(new HighscoreEntry(highscoreEntity.getPoints(), highscoreEntity.getName()));
        }

        return new Highscore(highscore);
    }

    @Override
    public Level getLevelData(Long levelId) throws JsonProcessingException {
        Optional<LevelEntity> optionalLevel = levelRepository.findById(levelId);

        if (optionalLevel.isEmpty()) return null;
        LevelEntity level = optionalLevel.get();

        List<EnrichedPlanet> enrichedPlanets = objectMapper.readValue(level.getObjects(), objectMapper.getTypeFactory().constructCollectionType(List.class, EnrichedPlanet.class));

        return new Level(Arrays.asList(new LayerInfo("PLANET_LAYER", enrichedPlanets, "objectgroup")), "orthogonal", new ArrayList<>());
    }

    @Override
    public LevelOverview getLevelOverview() {
        List<LevelEntity> allLevels = levelRepository.findAll();
        if (allLevels.isEmpty()) {
            return null;
        }
        List<OverviewLevel> overviewList = new ArrayList<>();
        for (LevelEntity level : allLevels) {
            overviewList.add(new OverviewLevel(level.getName(), level.getWidth().toString() + "x" + level.getHeight().toString(), level.getLevelId(), level.getMaxDistance(), level.getMinNeighbors(), level.getInitialTime(), level.getLevelX(), level.getHeightCorrection(), level.getWidth(), level.getHeight()));
        }
        return new LevelOverview(overviewList);
    }
}
