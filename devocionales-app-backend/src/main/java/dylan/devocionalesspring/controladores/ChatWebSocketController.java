package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.dto.MensajeDTO;
import dylan.devocionalesspring.dto.UsuarioDTO;
import dylan.devocionalesspring.entidades.Mensaje;
import dylan.devocionalesspring.servicios.MensajeServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class ChatWebSocketController {

    @Autowired
    private MensajeServicio mensajeServicio;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Cliente envía a: /app/chat.send
    @MessageMapping("/chat.send")
    public void enviarMensajeWebSocket(@Payload Map<String, String> payload) {
        Long emisorId = Long.parseLong(payload.get("emisorId"));
        Long receptorId = Long.parseLong(payload.get("receptorId"));
        String contenido = payload.get("contenido");

        Mensaje mensaje = mensajeServicio.enviarMensaje(emisorId, receptorId, contenido);

        MensajeDTO mensajeDTO = new MensajeDTO(
                mensaje.getId(),
                mensaje.getContenido(),
                mensaje.getFechaEnvio(),
                new UsuarioDTO(mensaje.getEmisor()),
                new UsuarioDTO(mensaje.getReceptor())
        );

        // Notificar a emisor y receptor en tiempo real
        messagingTemplate.convertAndSendToUser(mensaje.getEmisor().getIdUsuario().toString(), "/queue/messages", mensajeDTO);
        messagingTemplate.convertAndSendToUser(mensaje.getReceptor().getIdUsuario().toString(), "/queue/messages", mensajeDTO);
    }

}
