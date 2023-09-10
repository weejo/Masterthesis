package at.jwe.planetracer.repository;

import at.jwe.planetracer.data.entity.HighscoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HighscoreRepository extends JpaRepository<HighscoreEntity, Long> {

    List<HighscoreEntity> findAllByLevelId(Long levelId);
}
