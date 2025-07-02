package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.entidades.Mensaje;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.repositorios.MensajeRepositorio;
import dylan.devocionalesspring.servicios.MensajeServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/mensajes")
public class MensajeControlador {

    @Autowired
    private MensajeServicio mensajeServicio;

    @Autowired
    private MensajeRepositorio mensajeRepositorio;

    @PostMapping("/enviar")
    @SendTo("/topic/build")
    public ResponseEntity<Mensaje> enviarMensaje(@RequestBody @Payload Map<String, String> payload) {
        Long emisorId = Long.parseLong(payload.get("emisorId"));
        Long receptorId = Long.parseLong(payload.get("receptorId"));
        String contenido = payload.get("contenido");

        Mensaje mensaje = mensajeServicio.enviarMensaje(emisorId, receptorId, contenido);
        return ResponseEntity.ok(mensaje);
    }

    @GetMapping("/usuario/{receptorId}")
    @SendTo("/topic/build")
    public ResponseEntity<List<Mensaje>> obtenerMensajes(@PathVariable Long receptorId) {
        List<Mensaje> mensajes = mensajeServicio.obtenerMensajes(receptorId);
        return ResponseEntity.ok(mensajes);
    }

    @GetMapping("/conversaciones/{usuarioActualId}")
    @SendTo("/topic/build")
    public List<Usuario> obtenerConversaciones(@PathVariable("usuarioActualId") Long usuarioActualId) {
        return mensajeRepositorio.findConversacionesPorUsuario(usuarioActualId);
    }

    @GetMapping("/conversacion")
    @SendTo("/topic/build")
    public ResponseEntity<List<Mensaje>> obtenerConversacion(@RequestParam Long emisorId, @RequestParam Long receptorId,
                                                             SimpMessageHeaderAccessor headerAccessor) {
        List<Mensaje> conversacion = mensajeServicio.obtenerConversacion(emisorId, receptorId);
        headerAccessor.getSessionAttributes().put("username", receptorId);
        return ResponseEntity.ok(conversacion);
    }
}
