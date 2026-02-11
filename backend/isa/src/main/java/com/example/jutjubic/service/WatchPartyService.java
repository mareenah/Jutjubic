package com.example.jutjubic.service;

import com.example.jutjubic.dto.WatchPartyDto;
import com.example.jutjubic.model.User;
import com.example.jutjubic.model.WatchParty;

import java.util.List;
import java.util.UUID;

public interface WatchPartyService {
    WatchParty create(WatchPartyDto watchPartyDto);
    WatchParty findWatchPartyById(UUID id);
    List<WatchParty> findWatchPartiesByCreator(UUID creatorId);
    boolean findCreatorById(UUID creatorId);
    boolean findMemberById(UUID userId);
    List<WatchParty> findWatchPartiesByMember(UUID memberId);
    User mapToUser(User user);
    User getCreatorByWatchPartyId(UUID watchPartyId);
}
