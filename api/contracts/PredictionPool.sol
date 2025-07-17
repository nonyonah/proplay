// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PredictionPool {
    struct Prediction {
        address user;
        uint256 amount;
        uint8 predictedWinner; // 1 for team1, 2 for team2
        bool claimed;
    }

    struct Match {
        uint256 team1Pool;
        uint256 team2Pool;
        uint8 winner; // 0 = not decided, 1 = team1, 2 = team2
        bool finalized;
        mapping(address => Prediction) predictions;
        address[] predictors;
    }

    mapping(uint256 => Match) public matches;
    
    event PredictionMade(uint256 matchId, address user, uint8 predictedWinner, uint256 amount);
    event MatchFinalized(uint256 matchId, uint8 winner);
    event RewardClaimed(uint256 matchId, address user, uint256 amount);

    function makePrediction(uint256 matchId, uint8 predictedWinner) external payable {
        require(msg.value > 0, "Must stake some ETH");
        require(predictedWinner == 1 || predictedWinner == 2, "Invalid team selection");
        require(!matches[matchId].finalized, "Match already finalized");
        require(matches[matchId].predictions[msg.sender].amount == 0, "Already predicted");

        Match storage match = matches[matchId];
        match.predictions[msg.sender] = Prediction(msg.sender, msg.value, predictedWinner, false);
        match.predictors.push(msg.sender);
        
        if (predictedWinner == 1) {
            match.team1Pool += msg.value;
        } else {
            match.team2Pool += msg.value;
        }

        emit PredictionMade(matchId, msg.sender, predictedWinner, msg.value);
    }

    function finalizeMatch(uint256 matchId, uint8 winner) external {
        require(winner == 1 || winner == 2, "Invalid winner");
        require(!matches[matchId].finalized, "Match already finalized");
        
        Match storage match = matches[matchId];
        match.winner = winner;
        match.finalized = true;

        emit MatchFinalized(matchId, winner);
    }

    function claimReward(uint256 matchId) external {
        Match storage match = matches[matchId];
        require(match.finalized, "Match not finalized");
        
        Prediction storage prediction = match.predictions[msg.sender];
        require(prediction.amount > 0, "No prediction found");
        require(!prediction.claimed, "Reward already claimed");
        require(prediction.predictedWinner == match.winner, "Incorrect prediction");

        uint256 totalPool = match.team1Pool + match.team2Pool;
        uint256 winningPool = match.winner == 1 ? match.team1Pool : match.team2Pool;
        uint256 reward = (prediction.amount * totalPool) / winningPool;

        prediction.claimed = true;
        payable(msg.sender).transfer(reward);

        emit RewardClaimed(matchId, msg.sender, reward);
    }

    function getMatchPrediction(uint256 matchId, address user) external view returns (
        uint256 amount,
        uint8 predictedWinner,
        bool claimed
    ) {
        Prediction storage pred = matches[matchId].predictions[user];
        return (pred.amount, pred.predictedWinner, pred.claimed);
    }

    function getMatchStats(uint256 matchId) external view returns (
        uint256 team1Pool,
        uint256 team2Pool,
        uint8 winner,
        bool finalized
    ) {
        Match storage match = matches[matchId];
        return (match.team1Pool, match.team2Pool, match.winner, match.finalized);
    }
}
