package dylan.devocionalesspring.servicios;

import dylan.devocionalesspring.entidades.Comentario;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.repositorios.ComentarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComentarioServicio {

    @Autowired
    private ComentarioRepositorio comentarioRepositorio;

    public Comentario guardarComentario(Comentario comentario, Usuario usuario) {
        comentario.setUsuario(usuario);
        return comentarioRepositorio.save(comentario);
    }

    public List<Comentario> obtenerComentariosPorDevocional(Long devocionalId) {
        return comentarioRepositorio.findByDevocionalId(devocionalId);
    }
}