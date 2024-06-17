package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.entidades.Comentario;
import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.excepciones.UsuarioNoEncontradoExcepcion;
import dylan.devocionalesspring.servicios.ComentarioServicio;
import dylan.devocionalesspring.servicios.DevocionalServicio;
import dylan.devocionalesspring.servicios.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
public class ComentarioControlador {

    @Autowired
    private ComentarioServicio comentarioServicio;

    @Autowired
    private UsuarioServicio usuarioServicio;

    @Autowired
    private DevocionalServicio devocionalServicio;


    @PostMapping("/devocionales/{devocionalId}/comentarios")
    public ResponseEntity<Comentario> agregarComentario(@PathVariable int devocionalId, @RequestBody Comentario comentario, Authentication authentication) throws UsuarioNoEncontradoExcepcion {
        // Aquí debes asociar el comentario al devocional correspondiente
        Devocional devocional = new Devocional();
        devocional.setId(devocionalId);
        comentario.setDevocional(devocional);

        // Obtén el usuario actual (puedes usar un método en tu servicio de usuario para obtenerlo)
        Usuario usuario = usuarioServicio.obtenerPerfilUsuario(authentication.getName()); // Implementa este método según tu lógica de autenticación

        // Asigna el usuario al comentario
        comentario.setUsuario(usuario);

        // Guarda el comentario
        Comentario comentarioGuardado = comentarioServicio.crearComentario(comentario);
        return ResponseEntity.ok(comentarioGuardado);
    }

    @GetMapping("/devocionales/{devocionalId}/comentarios")
    public ResponseEntity<List<Comentario>> obtenerComentariosPorDevocional(@PathVariable Long devocionalId) {
        List<Comentario> comentarios = comentarioServicio.obtenerComentariosPorDevocional(devocionalId);
        return ResponseEntity.ok(comentarios);
    }

}