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
            //[JsonProperty("questionList")]
            public object[] QuestionsJson { get; set; }
        }


        [FunctionName("getQuestions")]
        public static async Task<IActionResult> RunGet(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "questions/{imageId}")] HttpRequest req,
            [CosmosDB(
                databaseName: "medimages",
                collectionName: "Questions",
                ConnectionStringSetting = "CosmosDBConnection")
            ]  DocumentClient client,
            string imageId,
            ILogger log)
        {
            log.LogInformation($"function GetQuestions {imageId}");
            
            // Verify identity
            ClaimsPrincipal principal = ClientPrincipal.Parse(req);
            if (!principal.IsInRole("contributor"))
                return new UnauthorizedResult();
            
            string userId = principal.Identity.Name;
            QuestionsItem questions = null;
            try
            {
                var response = await client.ReadDocumentAsync<QuestionsItem>(
                    UriFactory.CreateDocumentUri("medimages", "Questions", imageId),
                    new RequestOptions { PartitionKey = new Microsoft.Azure.Documents.PartitionKey(imageId) });

                questions = (QuestionsItem)(dynamic)response;
                log.LogInformation($"function GetQuestions invoked {imageId} {questions}");

            } catch (Exception ) {
                log.LogError($"Cant find Questions entry for {imageId} in cosmosdb");
                return new NotFoundResult();
            }
            log.LogInformation($"Retrieved questions {questions.QuestionsJson}");
            if ( questions != null && questions.QuestionsJson != null && questions.QuestionsJson.Length > 0)
              return new OkObjectResult(questions.QuestionsJson);
            else
              return new NotFoundResult();
        }
    }
}