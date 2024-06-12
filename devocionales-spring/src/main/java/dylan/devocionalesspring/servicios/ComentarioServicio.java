package dylan.devocionalesspring.servicios;

import dylan.devocionalesspring.entidades.Comentario;
import dylan.devocionalesspring.dto.ComentarioDTO;
import dylan.devocionalesspring.mapper.ComentarioMapper;
import dylan.devocionalesspring.repositorios.ComentarioRepositorio;
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
    ComentarioMapper comentarioMapper;

//    @Transactional
//    public ComentarioDTO crearComentario(ComentarioDTO comentarioDTO) {
//        Comentario comentario = ComentarioMapper.toComentario(comentarioDTO);
//        comentario = comentarioRepositorio.save(comentario);
//        return ComentarioMapper.toComentarioDTO(comentario);
//    }
//
//    @Transactional
//    public ComentarioDTO actualizarComentario(ComentarioDTO comentarioDTO) {
//        Comentario comentario = comentarioRepositorio.findById(comentarioDTO.getId()).orElseThrow(() -> new IllegalArgumentException("Comentario no encontrado"));
//        comentario.setTexto(comentarioDTO.getTexto());
//        comentario.setFechaCreacion(comentarioDTO.getFechaCreacion());
//        comentario = comentarioRepositorio.save(comentario);
//        return ComentarioMapper.toComentarioDTO(comentario);
//    }
//
//    @Transactional
//    public List<ComentarioDTO> obtenerComentariosPorDevocional(Long devocionalId) {
//        List<Comentario> comentarios = comentarioRepositorio.findByDevocionalId(devocionalId);
//        return comentarios.stream()
//                .map(ComentarioMapper::toComentarioDTO)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public void eliminarComentario(Long id) {
//        comentarioRepositorio.deleteById(id);
//    }
}