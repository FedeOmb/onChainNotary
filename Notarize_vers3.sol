// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

/// @title contract for Notarization of Documents and Images
contract NotarizeTest3 {

    /// Struct to mantain all data related to a document
    struct Document {
        bytes docHash; //hash of document
        address uploader; // address of uploader
        uint256 timestamp; // timestamp of upload
        string hashAlgorithm; // algorithm used to generate document hash
        string extension; // document file extension
    }

    /// Struct to mantain all data related to an image
    struct Image {
        bytes imageHash; //hash of image content (excluding metadata)
        bytes fullHash; // hash of full image file (including metadata)
        address uploader; // address of uploader
        uint256 timestamp; // timestamp of upload
        string extension; // image file extension
        string imageHashAlgorithm; // algorithm used to generate hash of the image content (excluding metadata)
        string fullHashAlgorithm; // algorithm used to generate hash of the full image file
    }

    // Mapping of document internal keys to their data
    mapping(bytes32 => Document) private keyToDocument;
    // Mapping of image internal keys to their data
    mapping(bytes32 => Image) private keyToImage;
    // Mapping of keys for documents uploaded by each address
    mapping(address => bytes32[]) private addressToDocKeys;
    // Mapping of keys for images uploaded by each address
    mapping(address => bytes32[]) private addressToImageKeys;

    // Events emitted
    event DocumentStored(
        bytes32 indexed docKey,
        bytes docHash,
        address indexed uploader,
        uint256 timestamp,
        string hashAlgorithm,
        string extension
    );

    event ImageStored(
        bytes32 indexed imgKey,
        bytes imgHash,
        bytes fullHash,
        address indexed uploader,
        uint256 timestamp,
        string extension,
        string imageHashAlgorithm,
        string fullHashAlgorithm
    );

    /// @dev function to notarize a new document
    function notarizeDocument(
        bytes calldata _docHash,
        string calldata _hashAlgorithm,
        string calldata _extension
    ) external 
    {
        require(_docHash.length > 0, "Hash cannot be empty");

        bytes32 docKey = keccak256(_docHash);        
        require(
            keyToDocument[docKey].uploader == address(0),
            "Document hash already stored"
        );

        keyToDocument[docKey] = Document({
            docHash: _docHash,
            uploader: msg.sender,
            timestamp: block.timestamp,
            hashAlgorithm: _hashAlgorithm,
            extension: _extension
        });

        addressToDocKeys[msg.sender].push(docKey);

        emit DocumentStored(
            docKey,
            _docHash,
            msg.sender,
            block.timestamp,
            _hashAlgorithm,
            _extension
        );
    }

    /// @dev function to notarize a new image
    /// @param _imageHash, hash of the core image data (excluding metadata)
    /// @param _fullHash, hash of the full image file (including metadata)
    function notarizeImage(
        bytes calldata _imageHash,
        bytes calldata _fullHash,
        string calldata _extension,
        string calldata _imageHashAlgorithm,
        string calldata _fullHashAlgorithm
    ) external 
    {
        require(_imageHash.length > 0, "Hash cannot be empty");
        require(_fullHash.length > 0, "Hash cannot be empty");

        bytes32 imgKey = keccak256(_imageHash);
        require(keyToImage[imgKey].uploader == address(0), "Image hash already stored");

        keyToImage[imgKey] = Image({
            imageHash:_imageHash,
            fullHash: _fullHash,
            uploader: msg.sender,
            timestamp: block.timestamp,
            extension: _extension,
            imageHashAlgorithm: _imageHashAlgorithm,
            fullHashAlgorithm: _fullHashAlgorithm
        });

        addressToImageKeys[msg.sender].push(imgKey);

        emit ImageStored(
            imgKey,
            _imageHash,
            _fullHash,
            msg.sender,
            block.timestamp,
            _extension,
            _imageHashAlgorithm,
            _fullHashAlgorithm
        );
    }
    /// @dev function to get data of a stored document hash
    /// @param _docHash: hash of the wanted Document
    function getDocumentByHash(bytes calldata _docHash)
        external
        view
        returns (
            address uploader,
            uint256 timestamp,
            string memory hashAlgorithm,
            string memory extension
        )
    {
        require(_docHash.length > 0, "Hash cannot be empty");

        bytes32 docKey = keccak256(_docHash);   
        Document storage doc = keyToDocument[docKey];
        require(doc.uploader != address(0), "Document hash not found");

        return (doc.uploader, doc.timestamp, doc.hashAlgorithm, doc.extension);
    }

    /// @dev function to get document data using the internal key
    /// @param _docKey keccak256 hash used as internal key
    function getDocumentByKey(bytes32 _docKey)
        external
        view
        returns (
            bytes memory docHash,
            address uploader,
            uint256 timestamp,
            string memory hashAlgorithm,
            string memory extension
        )
    {
        require(_docKey != bytes32(0), "Key cannot be empty");
        
        Document storage doc = keyToDocument[_docKey];
        require(doc.uploader != address(0), "Document not found");

        return (
            doc.docHash,
            doc.uploader,
            doc.timestamp,
            doc.hashAlgorithm,
            doc.extension
        );
    }
    
    /// @dev function to get data of a stored image hash
    /// @param _imageHash: hash of the image content
    function getImageByHash(bytes calldata _imageHash)
        external
        view
        returns (
            bytes memory fullHash,
            address uploader,
            uint256 timestamp,
            string memory extension,
            string memory imageHashAlgorithm,
            string memory fullHashAlgorithm
        )
    {
        require(_imageHash.length > 0, "Image hash cannot be empty");

        bytes32 imgKey = keccak256(_imageHash);
        Image storage img = keyToImage[imgKey];
        require(img.uploader != address(0), "Image hash not found");

        return (
            img.fullHash,
            img.uploader,
            img.timestamp,
            img.extension,
            img.imageHashAlgorithm,
            img.fullHashAlgorithm
        );
    }

    /// @dev function to get image data using the internal key
    /// @param _imageKey keccak256 hash used as internal key
    function getImageByKey(bytes32 _imageKey)
        external
        view
        returns (
            bytes memory imageHash,
            bytes memory fullHash,
            address uploader,
            uint256 timestamp,
            string memory extension,
            string memory imageHashAlgorithm,
            string memory fullHashAlgorithm
        )
    {
        require(_imageKey != bytes32(0), "Key cannot be empty");
        
        Image storage img = keyToImage[_imageKey];
        require(img.uploader != address(0), "Image not found");

        return (
            img.imageHash,
            img.fullHash,            
            img.uploader,
            img.timestamp,
            img.extension,
            img.imageHashAlgorithm,
            img.fullHashAlgorithm
        );
    }

    /// @dev function to get all document keys stored for sender account
    function getMyDocumentsKeys()
        external
        view
        returns (bytes32[] memory docKeys)
    {
        return addressToDocKeys[msg.sender];
    }

    /// @dev function to get all image keys stored for sender account
    function getMyImagesKeys()
        external
        view
        returns (bytes32[] memory imageKeys)
    {
        return addressToImageKeys[msg.sender];
    }

    // @dev function to get the count of documents and images for sender account
    function getMyFilesCount()
        external
        view
        returns (uint256 docsCount, uint256 imgCount)
    {
        return (
            addressToDocKeys[msg.sender].length,
            addressToImageKeys[msg.sender].length
        );
    }

    function documentExistsByKey(bytes32 _docKey) external view returns (bool) {
        return keyToDocument[_docKey].uploader != address(0);
    }
    
    function imageExistsByKey(bytes32 _imgKey) external view returns (bool) {
        return keyToImage[_imgKey].uploader != address(0);
    }

    /// @dev check if a document exists using original hash
    function documentExistsByHash(bytes calldata _docHash) external view returns (bool) {
        if (_docHash.length == 0) return false;
        bytes32 docKey = keccak256(_docHash);
        return keyToDocument[docKey].uploader != address(0);
    }

    /// @dev check if an image exists using original hash
    function imageExists(bytes calldata _imageHash) external view returns (bool) {
        if (_imageHash.length == 0) return false;
        bytes32 imageKey = keccak256(_imageHash);
        return keyToImage[imageKey].uploader != address(0);
    }
}
