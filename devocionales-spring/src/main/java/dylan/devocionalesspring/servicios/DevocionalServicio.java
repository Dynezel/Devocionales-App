package dylan.devocionalesspring.servicios;

import dylan.devocionalesspring.entidades.Devocional;
import dylan.devocionalesspring.repositorios.DevocionalRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DevocionalServicio {

    @Autowired
    private DevocionalRepositorio devocionalRepositorio;

    @Transactional
    public Devocional crearDevocional(String nombre, String descripcion, LocalDate fechaCreacion) {
        Devocional devocional = new Devocional();
        devocional.setNombre(nombre);
        devocional.setDescripcion(descripcion);
        devocional.setFechaCreacion(fechaCreacion);

        devocional = devocionalRepositorio.save(devocional);

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

    public void eliminarDevocional(int id) {
        devocionalRepositorio.deleteById(id);
    }

}
