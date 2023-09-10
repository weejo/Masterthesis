package at.jwe.planetracer.rest;

import at.jwe.planetracer.data.record.*;
import at.jwe.planetracer.data.record.cluster.ClusterResult;
import at.jwe.planetracer.data.record.cluster.IncidenceMatrix;
import at.jwe.planetracer.data.record.cluster.IncidenceResult;
import at.jwe.planetracer.data.record.highscore.Highscore;
import at.jwe.planetracer.data.record.level.Level;
import at.jwe.planetracer.service.DataService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/")
class PlanetracerController {

    @Autowired
    private DataService dataService;

    /**
     * Used to create new Levels - you can basically parse panda frames that have been parsed with df.to_json(orient='index') and with the columns: x & y
     *
     * @param mapData the name + planets that should be put inside the level
     * @return whether the level got created
     */
    @PostMapping(path = "level",
            produces = "application/json",
            consumes = "application/json")
    public ResponseEntity<Boolean> addLevel(@RequestBody MapData mapData) throws JsonProcessingException {
        return ResponseEntity.ok(dataService.addLevel(mapData));
    }

    /**
     * Used to retrieve all user generated clusters for a given level.
     * @param levelId the levelid you want all clusters from
     * @return all user generated clusters
     * @throws JsonProcessingException - the clusters are saved as json strings. should "never(TM)" be thrown.
     */

    @GetMapping(path = "clusters",
            produces = "application/json")
    public ResponseEntity<ClusterResult> getClusters(@RequestParam Long levelId) throws JsonProcessingException {
        ClusterResult clusters = dataService.getClusters(levelId);
        if (clusters == null) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(clusters);
        }
    }

    /**
     * Used to retrieve incidence matrices for user generated clusters for a given level.
     * @param levelId the levelid you want all clusters from
     * @return all user generated cluster incidence matrices
     * @throws JsonProcessingException - the clusters are saved as json strings. should "never(TM)" be thrown.
     */
    @GetMapping(path = "incidence",
            produces = "application/json")
    public ResponseEntity<List<IncidenceMatrix>> getIncidences(@RequestParam Long levelId) throws JsonProcessingException {
        List<IncidenceMatrix> incidences = dataService.getIncidences(levelId);
        if (incidences == null) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(incidences);
        }
    }

    /**
     * Can be used to discover all existing levels - since accessing them to get clusters requires their ID.
     * @return all exisitng levels in a short overview.
     */
    @GetMapping(path = "overview",
            produces = "application/json")
    public ResponseEntity<LevelOverview> getLevelOverview() {
        return ResponseEntity.ok(dataService.getLevelOverview());
    }

    @GetMapping(path = "highscore",
            produces = "application/json")
    public ResponseEntity<Highscore> getHighscore(@RequestParam Long levelId) {
        return ResponseEntity.ok(dataService.getHighscore(levelId));
    }

    @PostMapping(path = "result",
            produces = "application/json",
            consumes = "application/json")
    public ResponseEntity<Boolean> addResult(@RequestBody PlayerResult playerResult) throws JsonProcessingException {
        boolean b = dataService.addResult(playerResult);
        return ResponseEntity.ok(b);
    }

    @GetMapping(path = "level",
            produces = "application/json")
    public ResponseEntity<Level> getLevelData(@RequestParam Long levelId) throws JsonProcessingException {
        return ResponseEntity.ok(dataService.getLevelData(levelId));
    }


}
