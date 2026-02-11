package com.example.jutjubic.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class WatchPartyEventDto {
    private String type; // VIDEO_STARTED, MEMBER_JOINED
    private UUID partyId;
    private UUID postId;
}
