package dylan.devocionalesspring.repositorios;

import dylan.devocionalesspring.entidades.Devocional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DevocionalRepositorio extends JpaRepository<Devocional, Integer> {

}
