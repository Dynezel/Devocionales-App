package dylan.devocionalesspring.mapper;

import dylan.devocionalesspring.dto.ComentarioDTO;
import dylan.devocionalesspring.entidades.Comentario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring", uses = {UsuarioMapper.class, DevocionalMapper.class})
public interface ComentarioMapper {

    ComentarioMapper INSTANCE = Mappers.getMapper(ComentarioMapper.class);

    @Mapping(source = "devocional.id", target = "idDevocional")
    @Mapping(source = "usuario", target = "usuario")
    ComentarioDTO toComentarioDTO(Comentario comentario);

    @Mapping(target = "devocional", ignore = true) // Ignora el mapeo de devocional, se debe hacer manualmente
    @Mapping(target = "usuario", ignore = true) // Ignora el mapeo de usuario, se debe hacer manualmente
    Comentario toComentario(ComentarioDTO comentarioDTO);
}
