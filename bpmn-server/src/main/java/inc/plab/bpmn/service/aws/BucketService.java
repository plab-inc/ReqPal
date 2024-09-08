package inc.plab.bpmn.service.aws;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BucketService {

    private final S3Client s3Client;

    public List<Bucket> getBucketList() {
        ListBucketsRequest listBucketsRequest = ListBucketsRequest.builder().build();
        ListBucketsResponse listBucketsResponse = s3Client.listBuckets(listBucketsRequest);
        return listBucketsResponse.buckets();
    }

    public InputStream getObjectStreamFromBucket(String bucketName, String objectKey) throws IOException {

        if (validateBucket(bucketName)) {
            throw new IOException("Bucket not present.");
        }

        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();
            return s3Client.getObject(getObjectRequest);
        } catch (S3Exception e) {
            System.err.println(e.awsErrorDetails().errorMessage());
            throw new IOException("Error getting object from S3", e);
        }
    }

    public void deleteObjectFromBucket(String bucketName, String objectKey) throws IOException {

        if (validateBucket(bucketName)) {
            throw new IOException("Bucket not present.");
        }

        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey)
                    .build();
            s3Client.deleteObject(deleteObjectRequest);
        } catch (S3Exception e) {
            System.err.println(e.awsErrorDetails().errorMessage());
            throw new IOException("Error deleting object from S3", e);
        }
    }

    private boolean validateBucket(String bucketName) {
        List<Bucket> bucketList = getBucketList();
        return bucketList.stream().noneMatch(m -> bucketName.equals(m.name()));
    }
}