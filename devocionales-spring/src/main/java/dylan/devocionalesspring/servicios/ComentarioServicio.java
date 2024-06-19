package dylan.devocionalesspring.servicios;

import com.sun.jdi.IntegerValue;
import dylan.devocionalesspring.entidades.Comentario;
import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.repositorios.ComentarioRepositorio;
import dylan.devocionalesspring.repositorios.DevocionalRepositorio;
import dylan.devocionalesspring.repositorios.UsuarioRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.lang.String.valueOf;

@Service
public class ComentarioServicio {

    @Autowired
    private ComentarioRepositorio comentarioRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private UsuarioServicio usuarioServicio;

    @Autowired
    private DevocionalRepositorio devocionalRepositorio;

    @Transactional
    public List<Comentario> obtenerComentariosPorDevocionalYUsuario(int devocionalId, Long usuarioId) {
        // Obtener los comentarios asociados al devocional
        List<Comentario> comentariosDevocional = devocionalRepositorio.findComentariosByDevocionalId(devocionalId);

        // Filtrar los comentarios por el usuario
        return comentariosDevocional.stream()
                .filter(comentario -> comentario.getIdUsuario().equals(usuarioId))
                .collect(Collectors.toList());
    }

    @Transactional
    public Comentario crearComentario(String email, int devocionalId, Comentario comentario) throws Exception {
        Usuario usuario = usuarioServicio.obtenerPerfilUsuario(email);

        Devocional devocional = devocionalRepositorio.findById(devocionalId)
                .orElseThrow(() -> new Exception("Devocional no encontrado"));

        comentario.setFechaCreacion(LocalDate.now());
        comentario.setIdUsuario(usuario.getIdUsuario());
        comentario.setIdDevocional(devocional.getId());

        // Primero guardamos el comentario en la base de datos
        Comentario comentarioGuardado = comentarioRepositorio.save(comentario);

        // Luego añadimos el comentario a las colecciones de usuario y devocional
        usuario.getComentarios().add(comentarioGuardado);
        devocional.getComentarios().add(comentarioGuardado);

        // Guardamos las relaciones
        usuarioRepositorio.save(usuario);
        devocionalRepositorio.save(devocional);

        return comentarioGuardado;
    }



    @Transactional
    public Comentario actualizarComentario(Comentario comentario) {
        comentario = comentarioRepositorio.findById(comentario.getId()).orElseThrow(() -> new IllegalArgumentException("Comentario no encontrado"));
        comentario.setTexto(comentario.getTexto());
        comentario.setFechaCreacion(comentario.getFechaCreacion());
        return comentarioRepositorio.save(comentario);
    }


    @Transactional
    public void eliminarComentario(Long id) {
        comentarioRepositorio.deleteById(id);
    }
}