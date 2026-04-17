// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ScoreBoard {
    struct Prediction {
        uint256 priceAtPrediction;
        bool direction; // true = up, false = down
        uint256 timestamp;
        bool resolved;
    }

    mapping(address => uint256) public scores;
    mapping(address => uint256) public streaks;
    mapping(address => uint256) public totalGames;
    mapping(address => Prediction) public predictions;

    event PredictionMade(address indexed player, uint256 price, bool direction);
    event PredictionResolved(address indexed player, bool won, uint256 points);

    function makePrediction(uint256 price, bool direction) external {
        predictions[msg.sender] = Prediction({
            priceAtPrediction: price,
            direction: direction,
            timestamp: block.timestamp,
            resolved: false
        });
        totalGames[msg.sender]++;
        emit PredictionMade(msg.sender, price, direction);
    }

    function resolvePrediction(uint256 finalPrice) external {
        Prediction storage p = predictions[msg.sender];
        require(!p.resolved, "Already resolved");
        require(p.timestamp > 0, "No prediction");

        p.resolved = true;
        bool won = p.direction ? finalPrice > p.priceAtPrediction : finalPrice < p.priceAtPrediction;

        if (won) {
            uint256 pts = 50 + (streaks[msg.sender] * 10);
            scores[msg.sender] += pts;
            streaks[msg.sender]++;
            emit PredictionResolved(msg.sender, true, pts);
        } else {
            streaks[msg.sender] = 0;
            emit PredictionResolved(msg.sender, false, 0);
        }
    }

    function getPlayer(address player) external view returns (
        uint256 score,
        uint256 streak,
        uint256 games
    ) {
        return (scores[player], streaks[player], totalGames[player]);
    }
}
