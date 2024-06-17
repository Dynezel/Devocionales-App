package dylan.devocionalesspring.servicios;

import dylan.devocionalesspring.entidades.Comentario;
import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.repositorios.ComentarioRepositorio;
import dylan.devocionalesspring.repositorios.DevocionalRepositorio;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComentarioServicio {

    @Autowired
    private ComentarioRepositorio comentarioRepositorio;

    @Autowired
    private DevocionalRepositorio devocionalRepositorio;

    @Transactional
    public Comentario crearComentario(Comentario comentario, int devocionalId, Usuario usuario) {
        // Asociar el usuario al comentario
        comentario.setUsuario(usuario);

        // Guardar el comentario primero
        Comentario comentarioGuardado = comentarioRepositorio.save(comentario);

        // Obtener el devocional por su ID
        Devocional devocional = devocionalRepositorio.findById(devocionalId)
                .orElseThrow(() -> new IllegalArgumentException("Devocional no encontrado"));

        // Agregar el comentario al devocional
        devocional.agregarComentario(comentarioGuardado);
        devocionalRepositorio.save(devocional); // Actualizar el devocional con el nuevo comentario

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