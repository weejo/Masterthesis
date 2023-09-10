package at.jwe.planetracer.service;

import at.jwe.planetracer.data.record.*;
import at.jwe.planetracer.data.record.cluster.ClusterResult;
import at.jwe.planetracer.data.record.cluster.IncidenceMatrix;
import at.jwe.planetracer.data.record.cluster.IncidenceResult;
import at.jwe.planetracer.data.record.highscore.Highscore;
import at.jwe.planetracer.data.record.level.Level;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;

public interface DataService {

    boolean addLevel(MapData mapData) throws JsonProcessingException;

    ClusterResult getClusters(Long levelId) throws JsonProcessingException;

    Highscore getHighscore(Long levelId);

    boolean addResult(PlayerResult playerResult) throws JsonProcessingException;

    Level getLevelData(Long levelId) throws JsonProcessingException;

    LevelOverview getLevelOverview();

    List<IncidenceMatrix> getIncidences(Long levelId) throws JsonProcessingException;
}
