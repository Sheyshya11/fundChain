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
        uint256 amountReleased;
        uint256 validFund;
        string image;
        address[] donators;
        bool[] voted;
        address[] uniqueDonators;
        uint256[] donations;
        string[] donatornames;
        bool openFunding;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        string memory _category,
        bool _openFunding,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            _deadline > block.timestamp,
            "The deadline should be a date in the future."
        );
                
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.category = _category;
        campaign.openFunding = _openFunding;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.amountReleased= 0;
        campaign.validFund= _target;
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
        bool approved;
        uint256 voteCount;
        address[] voters;
        bool complete;
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
       
         
        /*  require(
            _goal <= campaigns[request.campaignId].amountCollected,
            "The requested amount exceeds the funds available in the campaign."
        ); */
        require(_goal<=campaigns[_campaignId].validFund,"Amount is greater than fund collected");

        request.creator = _creator;
        request.campaignId = _campaignId;
        request.title = _title;
        request.description = _description;
        request.goal = _goal;
        request.recipient = _recipient;
        request.image = _image;
        request.approved = false;
        request.voteCount = 0;
        campaigns[_campaignId].validFund -= _goal;
        request.complete= false;
        numberOfRequests++;

       

        return numberOfRequests - 1;
    }

    function donateToCampaign(uint256 _id, string memory _name) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        require(
            msg.sender != campaign.owner,
            "Campaign owner cannot donate to their own campaign."
        );
        if(!campaign.openFunding){
        require(
            amount <= (campaign.target - campaign.amountCollected),
            "Donation exceeds campaign target."
        );}

        require(
            block.timestamp < campaign.deadline,
            "Deadline have been finished"
        );
       
        
         bool isNewDonator = true;
        for (uint256 i = 0; i < campaign.donators.length; i++) {
            if (campaign.donators[i] == msg.sender) {
                isNewDonator = false;
                break;
            }
        }

        if (isNewDonator) {
            campaign.uniqueDonators.push(msg.sender);
        }
        
        if((campaign.openFunding) && (campaign.amountCollected > campaign.target)){
            campaign.validFund = campaign.amountCollected;
        }
        bool isvoted = false;

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.donatornames.push(_name);
        campaign.voted.push(isvoted);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id)
        public
        view
        returns (string[] memory, address[] memory, uint256[] memory)
    {
        return (campaigns[_id].donatornames,campaigns[_id].donators, campaigns[_id].donations);
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

        require(campaigns[_id].amountReleased == 0,
        "Some funds already released. Cant delete");

        require(campaigns[_id].donations.length == 0,
        "Donation already started. Can't delete it anymore" );

        require(_id < numberOfCampaigns, "campaign not found");

        delete campaigns[_id];
        for (uint256 i = 0; i < numberOfRequests; i++) {
            if (requests[i].campaignId == _id) {
                delete requests[i];
            }
        }
       
    }

 function refund(uint256 _id) public payable {
    Campaign storage campaign = campaigns[_id];

    /* require(block.timestamp > campaign.deadline, "Refund is not available yet."); */
    require(campaign.amountReleased == 0, "Refund is not available because the campaign has already used some of the funds.");

    uint256 amountToRefund = 0;
     uint256 indexToRemove = campaign.donators.length;
    for (uint256 i = 0; i < campaign.donators.length; i++) {
        if (campaign.donators[i] == msg.sender) {
            if (campaign.donations[i] > 0) {

              indexToRemove = i;

             for( i = indexToRemove; i < campaign.donators.length-1; i++){
               campaign.donatornames[i] = campaign.donatornames[i+1];      
               campaign.donators[i] = campaign.donators[i+1];      
               campaign.donations[i] = campaign.donations[i+1];      
               }
                       campaign.donatornames.pop();
                       campaign.donators.pop();
                       campaign.donations.pop();
  
                amountToRefund += campaign.donations[i];
                campaign.donations[i] = 0;
             
              
            }
        }
    }

    if (amountToRefund > 0) {
        (bool sent, ) = payable(msg.sender).call{value: amountToRefund}("");

        require(sent, "Failed to send refund.");
    
      /*    delete campaign.donators[indexToRemove];
        delete campaign.donations[indexToRemove];
        delete campaign.donatornames[indexToRemove]; */
    }
}

    function voteForRequest(uint256 _requestId) public {
        Request storage request = requests[_requestId];
        Campaign storage campaign = campaigns[request.campaignId];

        for (uint256 i = 0; i < request.voters.length; i++) {
            require(
                request.voters[i] != msg.sender,
                "You have already voted for this request."
            );
        }
        bool donorExists = false;
        for (uint256 i = 0; i < campaign.donators.length; i++) {
            if (campaign.donators[i] == msg.sender) {
                donorExists = true;
                break;
            }
        }
        require(
            donorExists,
            "You must have donated to the associated campaign to vote."
        );
        require(
            request.complete==false,
            "Request is already approved"

        );
        require(request.voteCount !=    //changed from donators to uniquedonator
            campaigns[request.campaignId].uniqueDonators.length / 2 + 1,
            "Vote count already reached");
       
        request.voters.push(msg.sender);
        request.voteCount = request.voteCount + 1;
       

        if (
            (request.voteCount ==  //made changes here, added validation if amount collected is greater than request goal or not
            campaigns[request.campaignId].uniqueDonators.length / 2 + 1) && (campaigns[request.campaignId].amountCollected>=request.goal)
        ) {
            request.approved = true;
        }
    }

    function hasVoted(uint256 _id) public {
     Campaign storage campaign = campaigns[_id];
     for (uint256 i=0;i<campaign.donators.length;i++){
     if (campaign.donators[i] == msg.sender){   
         campaign.voted[i] = true;
        }
     }
    }
    function getVoted(uint256 _id) public view returns (bool[] memory){
        return campaigns[_id].voted;
    }

    function getVoter(uint256 _id) public view returns (address[] memory){
        return requests[_id].voters;
    }

   

    function finalizeRequest(uint256 _id) public payable {
    Request storage request = requests[_id];

    require(
        request.approved == true,
        "The request must be approved before finalizing."
    );
    require(
        request.goal <= campaigns[request.campaignId].amountCollected,
        "The requested amount exceeds the funds available in the campaign."
    );
    require(
        msg.sender == request.creator,
        "Only the request creator can finalize the request."
    );
    require(
            request.complete==false,
            "Request is alredy approved"

        );
   

    uint256 amount = request.goal;

    (bool sent, ) = payable(request.recipient).call{value: amount}("");

    if (sent) {
        campaigns[request.campaignId].amountReleased += amount;
        request.complete = true;
    }
} 

 function editDescription(uint256 _id, string memory _newDescription) public {
        // check if the campaign exists and if the caller is the owner
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner == msg.sender, "Only the owner can edit the campaign");
        campaign.description = _newDescription;
    }
}
