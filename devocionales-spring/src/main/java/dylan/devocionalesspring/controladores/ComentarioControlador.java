package dylan.devocionalesspring.controladores;

import com.fasterxml.jackson.databind.JsonNode;
import dylan.devocionalesspring.entidades.Comentario;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.excepciones.UsuarioNoEncontradoExcepcion;
import dylan.devocionalesspring.repositorios.ComentarioRepositorio;
import dylan.devocionalesspring.servicios.ComentarioServicio;
import dylan.devocionalesspring.servicios.DevocionalServicio;
import dylan.devocionalesspring.servicios.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

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

     @Autowired
     private ComentarioRepositorio comentarioRepositorio;

    @GetMapping("/devocionales/{devocionalId}/comentarios")
    public ResponseEntity<List<Comentario>> getComentariosByDevocional(@PathVariable Long devocionalId) {
        List<Comentario> comentarios = comentarioServicio.obtenerComentariosPorDevocional(devocionalId);
        return ResponseEntity.ok(comentarios);
    }

    @PostMapping("/comentarios")
    public ResponseEntity<JsonNode> agregarComentario(@RequestBody Comentario comentario, Authentication authentication) throws UsuarioNoEncontradoExcepcion {
        // Obtén el usuario autenticado
        String nombreUsuario = ((UserDetails) authentication.getPrincipal()).getUsername();
        comentario.setUsuario(usuarioServicio.obtenerPerfilUsuario(nombreUsuario));
        comentario.setFechaCreacion(LocalDate.now());

        // Asigna el devocional correspondiente
        comentario.setDevocional(devocionalServicio.encontrarDevocionalPorId(comentario.getDevocional().getId()));

        // Guarda y devuelve el comentario en formato JSON
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(comentarioRepositorio.save(comentario).asJson());
    }

    @PutMapping("/comentarios")
    public ResponseEntity<JsonNode> actualizarComentario(@RequestBody Comentario comentario) {
        // Encuentra el comentario existente y actualiza su contenido
        return comentarioRepositorio.findById(comentario.getId())
                .map(existingComment -> {
                    existingComment.setTexto(comentario.getTexto());
                    existingComment.setFechaCreacion(LocalDate.now());
                    return comentarioRepositorio.save(existingComment);
                })
                .map(Comentario::asJson)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/comentarios/{id}")
    public ResponseEntity<HttpStatus> eliminarComentario(@PathVariable Long id) {
        // Elimina el comentario por su ID
        comentarioRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}