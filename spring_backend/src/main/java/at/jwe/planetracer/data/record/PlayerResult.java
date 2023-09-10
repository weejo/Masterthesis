package at.jwe.planetracer.data.record;

import at.jwe.planetracer.data.record.cluster.Cluster;
import at.jwe.planetracer.data.record.highscore.HighscoreEntry;

import java.util.List;

public record PlayerResult(HighscoreEntry entry, List<Cluster> clusters, Long levelId) {
}
