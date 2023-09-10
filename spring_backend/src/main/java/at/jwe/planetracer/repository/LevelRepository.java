package at.jwe.planetracer.repository;

import at.jwe.planetracer.data.entity.LevelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LevelRepository extends JpaRepository<LevelEntity, Long> {
    Optional<LevelEntity> findByName(String name);

    @Override
    List<LevelEntity> findAll();
}
