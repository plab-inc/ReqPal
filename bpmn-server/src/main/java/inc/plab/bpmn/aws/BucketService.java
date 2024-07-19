package inc.plab.bpmn.aws;

import software.amazon.awssdk.services.s3.model.Bucket;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

public interface BucketService {
    List<Bucket> getBucketList();
    boolean validateBucket(String bucketName);
    InputStream getObjectFromBucket(String bucketName, String objectName) throws IOException;
}