package dylan.devocionalesspring.servicios;

import dylan.devocionalesspring.entidades.MeGusta;
import dylan.devocionalesspring.repositorios.DevocionalRepositorio;
import dylan.devocionalesspring.repositorios.MeGustaRepositorio;
import dylan.devocionalesspring.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MeGustaServicio {

    @Autowired
    private MeGustaRepositorio meGustaRepositorio;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private DevocionalRepositorio devocionalRepositorio;

    @Transactional
    public MeGusta toggleMeGusta(Long usuarioId, int devocionalId) {
        Optional<MeGusta> meGustaExistente = meGustaRepositorio.findByUsuarioIdAndDevocionalId(usuarioId, (long) devocionalId);
        if (meGustaExistente.isPresent()) {
            meGustaRepositorio.delete(meGustaExistente.get());
            return null; // Indica que se quitó el "Me Gusta"
        } else {
            MeGusta meGusta = new MeGusta();
            meGusta.setUsuarioId(usuarioId);
            meGusta.setDevocionalId((long) devocionalId);
            return meGustaRepositorio.save(meGusta); // Se agregó un nuevo "Me Gusta"
        }
    }

    public List<MeGusta> obtenerMeGustasPorDevocional(int devocionalId) {
        return meGustaRepositorio.findByDevocionalId(devocionalId);
    }

    public List<MeGusta> obtenerMeGustasPorUsuario(Long usuarioId) {
        return meGustaRepositorio.findByUsuarioId(usuarioId);
    }
}
