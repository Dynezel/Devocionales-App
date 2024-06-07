package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.entidades.Comentario;
import dylan.devocionalesspring.servicios.ComentarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comentarios")
public class ComentarioControlador {

    @Autowired
    private ComentarioServicio comentarioServicio;

    @PostMapping("/agregar")
    public Comentario agregarComentario(@RequestBody Comentario comentario) {
        return comentarioServicio.guardarComentario(comentario);
    }

    @GetMapping("/devocional/{devocionalId}")
    public List<Comentario> obtenerComentarios(@PathVariable int devocionalId) {
        return comentarioServicio.obtenerComentariosPorDevocional(devocionalId);
    }
}