package dylan.devocionalesspring.mapper;

import dylan.devocionalesspring.dto.UsuarioDTO;
import dylan.devocionalesspring.entidades.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    @Mapping(target = "idUsuario", expression = "java(usuarioDTO.getIdUsuario())")
    UsuarioDTO toUsuarioDTO(Usuario usuario);

    @Mapping(target = "devocionales", ignore = true)
    Usuario toUsuario(UsuarioDTO usuarioDTO);
}