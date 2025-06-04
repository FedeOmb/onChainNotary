// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

/// @title contract for Notarization of Documents and Images
contract NotarizeTest2 {

    /// Struct to mantain all data related to a document
    struct Document {
        address uploader; // address of uploader
        uint256 timestamp; // timestamp of upload
        string hashAlgorithm; // algorithm used to generate document hash
        string extension; // document file extension
    }

    /// Struct to mantain all data related to an image
    struct Image {
        address uploader; // address of uploader
        uint256 timestamp; // timestamp of upload
        bytes32 fullHash; // hash of full image file (including metadata)
        string extension; // image file extension
        string imageHashAlgorithm; // algorithm used to generate hash of the image content (excluding metadata)
        string fullHashAlgorithm; // algorithm used to generate hash of the full image file
    }

    // Mapping of document hashes to their data
    mapping(bytes32 => Document) private hashToDocument;
    // Mapping of image hashes to their data
    // image content hash is used to store and retrieve images
    mapping(bytes32 => Image) private hashToImage;
    // Mapping of document hashes uploaded by each address
    mapping(address => bytes32[]) private addressToDocHashes;
    // Mapping of image hashes uploaded by each address
    mapping(address => bytes32[]) private addressToImageHashes;

    // Events emitted
    event DocumentStored(
        bytes32 indexed docHash,
        address indexed uploader,
        uint256 timestamp,
        string hashAlgorithm,
        string extension
    );

    event ImageStored(
        bytes32 indexed imgHash,
        address indexed uploader,
        uint256 timestamp,
        bytes32 fullHash,
        string extension,
        string imageHashAlgorithm,
        string fullHashAlgorithm
    );

    /// @dev function to notarize a new document
    function notarizeDocument(
        bytes32 _docHash,
        string calldata _hashAlgorithm,
        string calldata _extension
    ) external 
    {
        require(_docHash != bytes32(0), "Hash cannot be empty");
        require(
            hashToDocument[_docHash].uploader == address(0),
            "Document hash already stored"
        );

        hashToDocument[_docHash] = Document({
            uploader: msg.sender,
            timestamp: block.timestamp,
            hashAlgorithm: _hashAlgorithm,
            extension: _extension
        });

        addressToDocHashes[msg.sender].push(_docHash);

        emit DocumentStored(
            _docHash,
            msg.sender,
            block.timestamp,
            _hashAlgorithm,
            _extension
        );
    }

    /// @dev function to notarize a new image
    /// @param _imgHash, hash of the core image data (excluding metadata)
    /// @param _fullHash, hash of the full image file (including metadata)
    function notarizeImage(
        bytes32 _imgHash,
        bytes32 _fullHash,
        string calldata _extension,
        string calldata _imageHashAlgorithm,
        string calldata _fullHashAlgorithm
    ) external 
    {
        require(_imgHash != bytes32(0), "Hash cannot be empty");
        require(_fullHash != bytes32(0), "Hash cannot be empty");
        require(hashToImage[_imgHash].uploader == address(0), "Image hash already stored");

        hashToImage[_imgHash] = Image({
            uploader: msg.sender,
            timestamp: block.timestamp,
            fullHash: _fullHash,
            extension: _extension,
            imageHashAlgorithm: _imageHashAlgorithm,
            fullHashAlgorithm: _fullHashAlgorithm
        });

        addressToImageHashes[msg.sender].push(_imgHash);

        emit ImageStored(
            _imgHash,
            msg.sender,
            block.timestamp,
            _fullHash,
            _extension,
            _imageHashAlgorithm,
            _fullHashAlgorithm
        );
    }
    /// @dev function to get data of a stored document hash
    /// @param _docHash: hash of the wanted Document
    function getDocument(bytes32 _docHash)
        external
        view
        returns (
            address uploader,
            uint256 timestamp,
            string memory hashAlgorithm,
            string memory extension
        )
    {
        require(_docHash != bytes32(0), "Hash cannot be empty");

        Document storage doc = hashToDocument[_docHash];
        require(doc.uploader != address(0), "Document hash not found");

        return (doc.uploader, doc.timestamp, doc.hashAlgorithm, doc.extension);
    }
    /// @dev function to get data of a stored image hash
    /// @param _imgHash: hash of the image content
    function getImage(bytes32 _imgHash)
        external
        view
        returns (
            address uploader,
            uint256 timestamp,
            bytes32 fullHash,
            string memory extension,
            string memory imageHashAlgorithm,
            string memory fullHashAlgorithm
        )
    {
        require(_imgHash != bytes32(0), "Hash cannot be empty");

        Image storage img = hashToImage[_imgHash];
        require(img.uploader != address(0), "Image hash not found");

        return (
            img.uploader,
            img.timestamp,
            img.fullHash,
            img.extension,
            img.imageHashAlgorithm,
            img.fullHashAlgorithm
        );
    }
    /// @dev function to get all document hashes stored for sender account
    function getMyDocumentsHashes()
        external
        view
        returns (bytes32[] memory docs)
    {
        return addressToDocHashes[msg.sender];
    }

    /// @dev function to get all image hashes stored for sender account
    function getMyImagesHashes()
        external
        view
        returns (bytes32[] memory images)
    {
        return addressToImageHashes[msg.sender];
    }

    // @dev function to get the count of documents and images for sender account
    function getMyFilesCount()
        external
        view
        returns (uint256 docsCount, uint256 imgCount)
    {
        return (
            addressToDocHashes[msg.sender].length,
            addressToImageHashes[msg.sender].length
        );
    }

    function documentExists(bytes32 _docHash) external view returns (bool) {
        return hashToDocument[_docHash].uploader != address(0);
    }
    
    function imageExists(bytes32 _imgHash) external view returns (bool) {
        return hashToImage[_imgHash].uploader != address(0);
    }
}
