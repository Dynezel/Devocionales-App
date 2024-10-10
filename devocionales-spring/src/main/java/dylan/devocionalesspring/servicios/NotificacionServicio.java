package dylan.devocionalesspring.servicios;

import dylan.devocionalesspring.entidades.Notificacion;
import dylan.devocionalesspring.repositorios.NotificacionRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class NotificacionServicio {

    @Autowired
    private NotificacionRepositorio notificacionRepositorio;

    public List<Notificacion> obtenerNotificaciones(Long usuarioId) {
        return notificacionRepositorio.findByUsuarioReceptorId(Collections.singletonList(usuarioId));
    }

    public Notificacion crearNotificacion(String tipo, String mensaje, List<Long> usuarioReceptorId, Long usuarioEmisorId, String a) {
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(tipo);
        notificacion.setMensaje(mensaje);
        notificacion.setUsuarioReceptorId(usuarioReceptorId);
        notificacion.setUsuarioEmisorId(usuarioEmisorId);
        notificacion.setUrl(a);
        notificacion.setVisto(false);
        notificacion.setTimestamp(LocalDateTime.now());
        return notificacionRepositorio.save(notificacion);
    }

    public List<Notificacion> obtenerNotificacionesNoLeidas(Long usuarioId) {
        return notificacionRepositorio.findByUsuarioReceptorIdAndVistoFalse(Collections.singletonList(usuarioId));
    }

    public Notificacion marcarComoLeida(Long notificacionId) {
        Optional<Notificacion> notificacionOpt = notificacionRepositorio.findById(notificacionId);
        if (notificacionOpt.isPresent()) {
            Notificacion notificacion = notificacionOpt.get();
            notificacion.setVisto(true);
            return notificacionRepositorio.save(notificacion);
        } else {
            throw new RuntimeException("Notificación no encontrada");
        }
    }

    public void eliminarNotificacion(Long id) {
        notificacionRepositorio.deleteById(id);
    }
}
