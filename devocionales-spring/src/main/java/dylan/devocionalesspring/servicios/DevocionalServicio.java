package dylan.devocionalesspring.servicios;

import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.entidades.Usuario;
import dylan.devocionalesspring.repositorios.DevocionalRepositorio;
import dylan.devocionalesspring.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class DevocionalServicio {

    @Autowired
    private DevocionalRepositorio devocionalRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Transactional
    public Devocional crearDevocional(String nombre, String descripcion, LocalDate fechaCreacion, Usuario usuario) {
        Devocional devocional = new Devocional();
        devocional.setNombre(nombre);
        devocional.setDescripcion(descripcion);
        devocional.setFechaCreacion(fechaCreacion);
        devocional.setAutor(usuario);

        devocional = devocionalRepositorio.save(devocional);

        // Agregar el nuevo devocional a la lista de devocionales del usuario
        List<Devocional> devocionalesUsuario = usuario.getDevocionales();
        devocionalesUsuario.add(devocional);
        usuario.setDevocionales(devocionalesUsuario);

        return devocional;
    }

    @Transactional
    public boolean modificarDevocional(int id, String nombre, String descripcion) {

        Optional<Devocional> respuesta = devocionalRepositorio.findById(id);
        if (respuesta.isPresent()) {
            Devocional devocional = respuesta.get();
            devocional.setNombre(nombre);
            devocional.setDescripcion(descripcion);

            devocionalRepositorio.save(devocional);
            return true;
        }
        else {
            return false;
        }
    }

    public List<Devocional> listarDevocionales() {
        return devocionalRepositorio.findAll();
    }

    public Devocional encontrarDevocionalPorId(int id) {
        Optional<Devocional> devocionalOptional = devocionalRepositorio.findById(id);
        return devocionalOptional.orElse(null); // Devuelve null si la tarea no se encuentra
    }

    @Transactional
    public List<Devocional> listarDevocionalesConAutores() {
        List<Devocional> devocionales = devocionalRepositorio.findAll();

        for (Devocional devocional : devocionales) {
            Long autorId = devocional.getAutor().getIdUsuario();
            Usuario autor = usuarioRepositorio.findById(autorId).orElse(null);
            devocional.setAutor(autor);
        }

        return devocionales;
    }

    public void eliminarDevocional(int id) {
        devocionalRepositorio.deleteById(id);
    }

}
