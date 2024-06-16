package dylan.devocionalesspring.servicios;

import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.enumeraciones.Rol;
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
import java.util.stream.Collectors;

@Service
public class DevocionalServicio {

    @Autowired
    private DevocionalRepositorio devocionalRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    public Usuario crearDevocional(String nombre, String descripcion, LocalDate fechaCreacion, Usuario usuario) {
        Devocional devocional = new Devocional();
        devocional.setNombre(nombre);
        devocional.setDescripcion(descripcion);
        devocional.setFechaCreacion(fechaCreacion);
        usuario.setDevocionales(Collections.singletonList(devocional));

        return usuarioRepositorio.save(usuario);
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
        } else {
            return false;
        }
    }

    public List<Devocional> obtenerTodosDevocionales() {
        return devocionalRepositorio.findAll();
    }

    public Optional<Devocional> obtenerDevocionalPorId(int id) {
        return devocionalRepositorio.findById(id);
    }

    public Usuario obtenerUsuarioPorId(Long idUsuario) {
        return usuarioRepositorio.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional
    public void eliminarDevocional(int id) {
        devocionalRepositorio.deleteById(id);
    }
}