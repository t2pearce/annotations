using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.Documents.Client;
using System.Security.Claims;


namespace Microsoft.Function
{
    public static class Questions
    {
        public class QuestionsItem 
        {
            [JsonProperty("id")]
            public string UserId { get; set; }
            [JsonProperty("questionList")]
            public object[] QuestionsJson { get; set; }
        }


        [FunctionName("questions")]
        public static async Task<IActionResult> RunGetQuestions(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "questions/{imageId}")] HttpRequest req,
            [CosmosDB(
                databaseName: "medimages",
                collectionName: "Questions",
                ConnectionStringSetting = "CosmosDBConnection")
            ]  DocumentClient client,
            string imageId,
            ILogger log)
        {
            log.LogInformation($"C# HTTP trigger Profile function processed a request for ");
            
            // Verify identity
            ClaimsPrincipal principal = ClientPrincipal.Parse(req);
            if (!principal.IsInRole("contributor"))
                return new UnauthorizedResult();
            
            string userId = principal.Identity.Name;
            QuestionsItem questionsItem = null;
            try
            {
                var response = await client.ReadDocumentAsync<QuestionsItem>(
                    UriFactory.CreateDocumentUri("medimages", "Questions", imageId),
                    new RequestOptions { PartitionKey = new Microsoft.Azure.Documents.PartitionKey(imageId) });

                questionsItem = (QuestioinsItem)(dynamic)response.Resource;

            } catch (Exception e) {
                log.LogError($"Cant find Profile entry for {userId} in cosmosdb");
            }

            if ( questionsItem != null && questionItem.QuestionsJson != null && questionsItem.QuestionsJson.Length > 0)
              return new OkObjectResult(questionsItem.QuestionsJson);
            else
              return new NotFoundResult();
        }
    }
}
