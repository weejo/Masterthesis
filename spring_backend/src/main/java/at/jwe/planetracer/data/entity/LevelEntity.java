package at.jwe.planetracer.data.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.dialect.PostgreSQLJsonPGObjectJsonType;
import org.springframework.boot.configurationprocessor.json.JSONObject;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "level")
@Table(name = "level", schema="planetracer", indexes = {
        @Index(name = "levelname", columnList = "name")
})
public class LevelEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="levelid")
    private Long levelId;

    @Column(name = "name")
    private String name;

    @Column(name = "maxdistance")
    private Long maxDistance;

    @Column(name = "minneighbors")
    private Long minNeighbors;

    @Column(name = "initialtime")
    private Long initialTime;

    @Column(name = "numplanets")
    private int numPlanets;

    @Column(name = "levelx")
    private Long levelX;

    @Column(name = "heightcorrection")
    private Long heightCorrection;

    @Column(name = "width")
    private Long width;

    @Column(name = "height")
    private Long height;

    @Column(name = "playerx")
    private Long playerX;

    @Column(name = "playery")
    private Long playerY;

    @Column(name = "objects")
    private String objects;
}
