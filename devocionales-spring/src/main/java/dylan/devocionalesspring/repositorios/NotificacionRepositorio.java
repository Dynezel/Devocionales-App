package dylan.devocionalesspring.repositorios;

import dylan.devocionalesspring.entidades.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificacionRepositorio extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioReceptorIdAndVistoFalse(Long usuarioReceptorId);

    @Query("SELECT n FROM Notificacion n WHERE n.usuarioReceptorId = :usuarioReceptorId ORDER BY n.timestamp DESC")
    List<Notificacion> findByUsuarioReceptorId(@Param("usuarioReceptorId") Long usuarioReceptorId);

}