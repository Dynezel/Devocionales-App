package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.dto.ComentarioDTO;
import dylan.devocionalesspring.dto.UsuarioDTO;
import dylan.devocionalesspring.excepciones.UsuarioNoEncontradoExcepcion;
import dylan.devocionalesspring.mapper.UsuarioMapper;
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

@RestController
public class ComentarioControlador {

//    @Autowired
//    private ComentarioServicio comentarioServicio;
//
//    @Autowired
//    private UsuarioServicio usuarioServicio;
//
//    @Autowired
//    private DevocionalServicio devocionalServicio;

//    @PostMapping("/comentarios")
//    public ResponseEntity<ComentarioDTO> agregarComentario(@RequestBody ComentarioDTO comentarioDTO, Authentication authentication) throws UsuarioNoEncontradoExcepcion {
//        String nombreUsuario = ((UserDetails) authentication.getPrincipal()).getUsername();
//        UsuarioDTO usuarioDTO = UsuarioMapper.toUsuarioDTO(usuarioServicio.obtenerPerfilUsuario(nombreUsuario));
//        comentarioDTO.setUsuario(usuarioDTO);
//        comentarioDTO.setFechaCreacion(LocalDate.now());
//
//        ComentarioDTO creadoComentario = comentarioServicio.crearComentario(comentarioDTO);
//        return ResponseEntity.status(HttpStatus.CREATED).body(creadoComentario);
//    }
}