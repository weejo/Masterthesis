package at.jwe.planetracer.data.record.level;

import at.jwe.planetracer.data.record.EnrichedPlanet;

import java.util.List;

public record LayerInfo(String name, List<EnrichedPlanet> objects, String type) {
}
