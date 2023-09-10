package at.jwe.planetracer.repository;

import at.jwe.planetracer.data.entity.ResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<ResultEntity, Long> {
    List<ResultEntity> findAllByLevelId(Long levelId);
}
