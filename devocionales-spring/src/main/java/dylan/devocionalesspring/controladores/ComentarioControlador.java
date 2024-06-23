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
    public ResponseEntity<Comentario> crearComentario(@PathVariable int devocionalId,
                                                      @RequestBody Comentario comentario,
                                                      Authentication authentication) {
        try {
            String email = authentication.getName();
            Comentario nuevoComentario = comentarioServicio.crearComentario(email, devocionalId, comentario);
            return new ResponseEntity<>(nuevoComentario, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    
    @GetMapping("/devocionales/{devocionalId}/comentarios")
    public ResponseEntity<List<Comentario>> obtenerComentariosPorDevocionalYUsuario(
            @PathVariable int devocionalId,
            @RequestParam Long usuarioId) {
        try {
            List<Comentario> comentarios = comentarioServicio.obtenerComentariosPorDevocionalYUsuario(devocionalId, usuarioId);
            return new ResponseEntity<>(comentarios, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }


}