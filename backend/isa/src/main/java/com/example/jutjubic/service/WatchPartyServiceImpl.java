package com.example.jutjubic.service;

import com.example.jutjubic.dto.WatchPartyDto;
import com.example.jutjubic.model.Post;
import com.example.jutjubic.model.User;
import com.example.jutjubic.model.WatchParty;
import com.example.jutjubic.repository.PostRepository;
import com.example.jutjubic.repository.UserRepository;
import com.example.jutjubic.repository.WatchPartyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    @Override
    public WatchParty create(WatchPartyDto watchPartyDto) {
        WatchParty watchParty = new WatchParty();
        UUID creatorId = UUID.fromString(watchPartyDto.getCreatorId());
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator not found"));
        ;
        UUID postId = UUID.fromString(watchPartyDto.getPostId());
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

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

}
