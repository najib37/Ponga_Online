import React from "react";

export interface ReplayState {
	Replay		:	boolean;
	SetReplay	:	React.Dispatch<React.SetStateAction<boolean>>;
	IsReplay	:	boolean;
	SetIsReplay	:	React.Dispatch<React.SetStateAction<boolean>>;
	Xp		:	number | undefined;
}
