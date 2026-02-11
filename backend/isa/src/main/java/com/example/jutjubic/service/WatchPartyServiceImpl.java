package com.example.jutjubic.service;

import com.example.jutjubic.dto.WatchPartyDto;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.model.User;
import com.example.jutjubic.model.WatchParty;
import com.example.jutjubic.repository.PostRepository;
import com.example.jutjubic.repository.UserRepository;
import com.example.jutjubic.repository.WatchPartyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class WatchPartyServiceImpl implements WatchPartyService {

    @Autowired
    private WatchPartyRepository watchPartyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostService postService;

    @Override
    public WatchParty create(WatchPartyDto watchPartyDto) {
        WatchParty watchParty = new WatchParty();
        UUID creatorId = UUID.fromString(watchPartyDto.getCreatorId());
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found."));

        UUID postId = UUID.fromString(watchPartyDto.getPostId());
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found."));

        List<UUID> memberIds = watchPartyDto.getMemberIds()
                .stream()
                .map(UUID::fromString)
                .toList();
        List<User> members = userRepository.findAllById(memberIds);

        watchParty.setId(UUID.randomUUID());
        watchParty.setCreator(creator);
        watchParty.setPost(post);
        watchParty.setMembers(members);

        return watchPartyRepository.save(watchParty);
    }

    @Override
    public WatchParty findWatchPartyById(UUID id) {
        WatchParty party =  watchPartyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Watch party not found."));
        if(party.getPost() !=null)
            party.setPost(postService.mapToObject(party.getPost()));
        return  party;
    }

    @Override
    public List<WatchParty> findWatchPartiesByCreator(UUID creatorId) {
        List<WatchParty> parties = watchPartyRepository.findByCreator_Id(creatorId);
        if (parties.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Watch parties not found");
        parties.forEach(party -> {
            if(party.getPost() != null)
                party.setPost(postService.mapToObject(party.getPost()));
        });
        return parties;
    }

    @Override
    public boolean findCreatorById(UUID creatorId) {
        return watchPartyRepository.existsByCreator_Id(creatorId);
    }

    @Override
    public boolean findMemberById(UUID userId) {
        return watchPartyRepository.existsByMembers_Id(userId);
    }

    @Override
    public List<WatchParty> findWatchPartiesByMember(UUID memberId) {
        List<WatchParty> parties = watchPartyRepository.findByMembers_Id(memberId);
        if (parties.isEmpty())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Watch parties not found");
        parties.forEach(party -> {
            if (party.getPost() != null) {
                party.setPost(postService.mapToObject(party.getPost()));
            }
        });
        return parties;
    }

    @Override
    public User getCreatorByWatchPartyId(UUID watchPartyId) {
        WatchParty party = watchPartyRepository.findById(watchPartyId)
                .orElseThrow(() -> new RuntimeException("Watch party not found"));

        User creator = userRepository.findById(party.getCreator().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUser(creator);
    }

    @Override
    public User mapToUser(User user) {
        return new User (
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getPassword(),
                user.getName(),
                user.getLastname(),
                user.isEnabled(),
                user.getVerificationCode(),
                user.getCodeCreatedAt(),
                user.getAddress()
        );
    }

}
