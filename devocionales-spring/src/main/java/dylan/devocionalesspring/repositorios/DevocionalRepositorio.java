package dylan.devocionalesspring.repositorios;

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

    @Query("SELECT d FROM Devocional d WHERE d.autor.id = :usuarioId")
    Usuario buscarPorUsuarioId(Long usuarioId);

    @Query("SELECT d FROM Devocional d LEFT JOIN FETCH d.autor")
    List<Devocional> findAllWithAutor();

    @Query("SELECT d FROM Devocional d LEFT JOIN FETCH d.autor WHERE d.id = :id")
    Optional<Devocional> findByIdWithAutor(@Param("id") int id);

}
