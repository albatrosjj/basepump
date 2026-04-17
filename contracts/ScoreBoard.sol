// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ScoreBoard {
    mapping(address => uint256) public scores;
    mapping(address => uint256) public streaks;
    mapping(address => uint256) public totalGames;
    mapping(address => uint256) public correctGuesses;

    event ScoreRecorded(address indexed player, uint256 points, uint256 newTotal, uint256 streak);

    function recordWin(uint256 currentStreak) external {
        uint256 points = 50 + (currentStreak * 10);
        scores[msg.sender] += points;
        streaks[msg.sender] = currentStreak + 1;
        totalGames[msg.sender]++;
        correctGuesses[msg.sender]++;
        emit ScoreRecorded(msg.sender, points, scores[msg.sender], streaks[msg.sender]);
    }

    function recordLoss() external {
        streaks[msg.sender] = 0;
        totalGames[msg.sender]++;
        emit ScoreRecorded(msg.sender, 0, scores[msg.sender], 0);
    }

    function getPlayer(address player) external view returns (
        uint256 score,
        uint256 streak,
        uint256 games,
        uint256 correct
    ) {
        return (
            scores[player],
            streaks[player],
            totalGames[player],
            correctGuesses[player]
        );
    }
}
