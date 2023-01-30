// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        string category;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            campaign.deadline < block.timestamp,
            "The deadline should be a date in the future."
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.category = _category;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    struct Request {
        address creator;
        uint256 campaignId;
        string title;
        string description;
        uint256 goal;
        address recipient;
        string image;
    }

    mapping(uint256 => Request) public requests;
    uint256 public numberOfRequests = 0;

    function createRequest(
        address _creator,
        uint256 _campaignId,
        string memory _title,
        string memory _description,
        uint256 _goal,
        address _recipient,
        string memory _image
    ) public returns (uint256) {
        Request storage request = requests[numberOfRequests];

        request.creator= _creator;
        request.campaignId= _campaignId;
        request.title = _title;
        request.description = _description;
        request.goal = _goal;
        request.recipient= _recipient;
        request.image = _image;
        numberOfRequests++;
        
        return numberOfRequests - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        require(
            msg.sender != campaign.owner,
            "Campaign owner cannot donate to their own campaign."
        );
        require(
            amount <= (campaign.target - campaign.amountCollected),
            "Donation exceeds campaign target."
        );
        require(
            block.timestamp < campaign.deadline,
            "Deadline have been finished"
        );

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id)
        public
        view
        returns (address[] memory, uint256[] memory)
    {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint256 i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }

    function getRequests() public view returns (Request[] memory) {
       Request[] memory allRequests = new Request[](numberOfRequests);


        for (uint256 i = 0; i < numberOfRequests; i++) {
            Request storage item = requests[i];

            allRequests[i] = item;
        }

        return allRequests;
    }
 
    function deleteCampaign(uint256 _id) public {
        require(
            campaigns[_id].owner == msg.sender,
            "Only the owner can delete a campaign."
        );
        require(_id < numberOfCampaigns, "campaign not found");
        delete campaigns[_id];
    }
}
