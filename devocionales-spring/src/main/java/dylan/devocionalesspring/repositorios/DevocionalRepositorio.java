package dylan.devocionalesspring.repositorios;

import dylan.devocionalesspring.entidades.Comentario;
import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DevocionalRepositorio extends JpaRepository<Devocional, Integer> {

    @Query("SELECT d.comentarios FROM Devocional d WHERE d.id = :devocionalId")
    List<Comentario> findComentariosByDevocionalId(@Param("devocionalId") int devocionalId);

}
