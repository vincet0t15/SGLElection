import { CandidateProps } from "./candidate";
import { PositionProps } from "./position";
import { VoterProps } from "./voter";

interface VoteProps {
    id: number;
    position_id: number;
    candidate_id: number;
    voter_id: number;
    position: PositionProps;
    candidate: CandidateProps;
    voter: VoterProps;
}