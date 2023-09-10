package at.jwe.planetracer.data.entity;


import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "highscore")
@Table(name = "highscore", schema="planetracer", indexes = {
        @Index(name = "levelid", columnList ="levelid")
})
public class HighscoreEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="HIGHSCOREID")
    private Long highscoreId;

    @Column(name = "LEVELID")
    private Long levelId;

    @Column(name = "POINTS")
    private int points;

    @Column(name = "NAME")
    private String name;
}
