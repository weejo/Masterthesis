package at.jwe.planetracer.data.record;

public record MapData(String name, Long maxDistance, Long minNeighbors, Long initialTime, Long heightCorrection, Planet[] planets) {
}
