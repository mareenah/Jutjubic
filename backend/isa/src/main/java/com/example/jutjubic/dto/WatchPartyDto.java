package com.example.jutjubic.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class WatchPartyDto {
    @NotNull
    private String creatorId;
    @NotEmpty
    private List<String> memberIds;
    @NotNull
    private String postId;
}

