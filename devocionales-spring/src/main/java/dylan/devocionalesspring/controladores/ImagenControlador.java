package dylan.devocionalesspring.controladores;

import dylan.devocionalesspring.entidades.Imagen;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.servicios.DevocionalServicio;
import dylan.devocionalesspring.servicios.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/imagen")
public class ImagenControlador {

    @Autowired
    UsuarioServicio usuarioServicio;

    @Autowired
    DevocionalServicio devocionalServicio;

    @GetMapping("/perfil/{idUsuario}")
    public ResponseEntity<byte[]> imagenUsuario(@PathVariable Long idUsuario) {
        Usuario usuario = usuarioServicio.getOne(idUsuario);

        if (usuario != null && usuario.getFotoPerfil() != null) {
            byte[] imagen = usuario.getFotoPerfil().getContenido();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            return new ResponseEntity<>(imagen, headers, HttpStatus.OK);
        } else {
            // Manejar el caso en que el usuario o la foto de perfil sea null
            // Por ejemplo, devolver una imagen por defecto o un mensaje de error
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
