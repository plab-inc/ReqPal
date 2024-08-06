package inc.plab.bpmn.aws;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
@RequiredArgsConstructor
public class S3BucketConfiguration {

    @Value("${app.aws.access.key.id}")
    private String awsAccessKeyId;

    @Value("${app.aws.access.key.secret}")
    private String awsAccessKeySecret;

    @Value("${app.aws.endpoint}")
    private String endpoint;

    @Bean
    public S3Client s3Client() {
        S3Configuration s3Config = S3Configuration.builder()
                .pathStyleAccessEnabled(true)
                .build();

        return S3Client.builder()
                .region(Region.EU_CENTRAL_1)
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(awsAccessKeyId, awsAccessKeySecret)))
                .endpointOverride(URI.create(endpoint))
                .serviceConfiguration(s3Config)
                .build();
    }
}
