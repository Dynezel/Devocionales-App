package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.entidades.Comentario;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.excepciones.UsuarioNoEncontradoExcepcion;
import dylan.devocionalesspring.servicios.ComentarioServicio;
import dylan.devocionalesspring.servicios.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comentarios")
public class ComentarioControlador {

    @Autowired
    private ComentarioServicio comentarioServicio;

    @Autowired
    private UsuarioServicio usuarioServicio;

    @PostMapping("/agregar")
    public Comentario agregarComentario(Authentication authentication, @RequestBody Comentario comentario) throws UsuarioNoEncontradoExcepcion {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }

        String email = authentication.getName();
        Usuario usuario = usuarioServicio.obtenerPerfilUsuario(email);
        return comentarioServicio.guardarComentario(comentario, usuario);
    }

    @GetMapping("/devocional/{devocionalId}")
    public List<Comentario> obtenerComentarios(@PathVariable int devocionalId) {
        return comentarioServicio.obtenerComentariosPorDevocional(devocionalId);
    }
}