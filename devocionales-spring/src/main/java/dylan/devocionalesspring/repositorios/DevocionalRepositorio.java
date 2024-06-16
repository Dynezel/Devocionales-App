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

    @Query("SELECT d, u.id FROM Devocional d " +
            "JOIN UsuarioDevocionales ud ON d.id = ud.devocionalesId " +
            "JOIN Usuario u ON ud.usuarioIdUsuario = u.id " +
            "WHERE u.id = :usuarioId")
    List<Object[]> findDevocionalesWithUserId(@Param("usuarioId") Long usuarioId);

}
